package org.complate.spring.boot.sample;

import org.complate.core.ComplateRenderer;
import org.complate.core.ComplateSource;
import org.complate.nashorn.NashornComplateRenderer;
import org.complate.spring.mvc.ComplateViewResolver;
import org.complate.spring.source.ResourceComplateSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class ComplateConfiguration {

    @Bean
    public ComplateSource complateSource(
        @Value("classpath:/templates/complate/bundle.js") Resource resource) {
        /*
         * Note that you have to make sure that the `/templates/complate/bundle.js`
         * file exists within your classpath on runtime and that this file exports
         * a function named `render` by default that has a matching signature:
         *
         * ```
         * export default function render(view, params, stream) {
         *     ...
         * }
         * ```
         *
         * Within this function you can use a complate Renderer to render JSX
         * based views. Because you then need to transpile your JavaScript code
         * you can use faucet or any other bundler that has support for
         * transpiling *.jsx files.
         */
        return new ResourceComplateSource(resource);
    }

    @Bean
    public ComplateRenderer complateRenderer(ComplateSource source) {
        /*
         * Note that it's possible to add global bindings that can be accessed
         * from your JSX views by providing a `Map<String, Object>` as second
         * argument to `NashornComplateRenderer`.
         *
         * Because `NashornComplateRenderer` only evaluates the given `ComplateSource`
         * on instantiation changes made to this source afterwards will not be
         * picked up. If you want to re-evaluate the `ComplateSource` on every call
         * to `render` you can wrap the `NashornComplateRenderer` within an
         * `ComplateReEvaluatingRenderer`.
         *
         * If you encounter problems that may be related with the multi threaded
         * nature of a Spring web application you can wrap the `NashornComplateRenderer`
         * (or `ComplateReEvaluatingRenderer`) within an `ComplateThreadLocalRenderer`.
         * This will create an instance that is exclusively used within a thread.
         */
        return new NashornComplateRenderer(source);
    }

    @Bean
    public ComplateViewResolver complateViewResolver(ComplateRenderer renderer) {
        return new ComplateViewResolver(renderer);
    }
}
